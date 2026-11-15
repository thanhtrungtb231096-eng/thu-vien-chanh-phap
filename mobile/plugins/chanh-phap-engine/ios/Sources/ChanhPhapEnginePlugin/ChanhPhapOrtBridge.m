#import "ChanhPhapOrtBridge.h"

#if __has_include("onnxruntime_c_api.h")
#include "onnxruntime_c_api.h"
#define CP_HAS_ORT_C 1
#elif __has_include(<onnxruntime/onnxruntime_c_api.h>)
#include <onnxruntime/onnxruntime_c_api.h>
#define CP_HAS_ORT_C 1
#elif __has_include(<onnxruntime_c/onnxruntime_c_api.h>)
#include <onnxruntime_c/onnxruntime_c_api.h>
#define CP_HAS_ORT_C 1
#else
#define CP_HAS_ORT_C 0
#endif

@implementation ChanhPhapOrtTensor

- (instancetype)initWithData:(NSData *)data
                       dtype:(ChanhPhapOrtDType)dtype
                       shape:(NSArray<NSNumber *> *)shape {
    self = [super init];
    if (self) {
        _data = [data copy];
        _dtype = dtype;
        _shape = [shape copy];
    }
    return self;
}

@end

@implementation ChanhPhapOrtSession {
#if CP_HAS_ORT_C
    const OrtApi *_ort;
    OrtSession *_session;
    NSString *_firstOutputName;
#endif
}

#if CP_HAS_ORT_C
static const OrtApi *cpSharedOrtApi(void) {
    const OrtApiBase *base = OrtGetApiBase();
    return base ? base->GetApi(ORT_API_VERSION) : NULL;
}

static OrtEnv *cpSharedOrtEnv(const OrtApi *ort) {
    static OrtEnv *sEnv = NULL;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (ort) {
            OrtStatus *st = ort->CreateEnv(ORT_LOGGING_LEVEL_WARNING, "ChanhPhapOrt", &sEnv);
            if (st) {
                ort->ReleaseStatus(st);
                sEnv = NULL;
            }
        }
    });
    return sEnv;
}

static OrtMemoryInfo *cpSharedCpuMemoryInfo(const OrtApi *ort) {
    static OrtMemoryInfo *sMem = NULL;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (ort) {
            OrtStatus *st = ort->CreateCpuMemoryInfo(OrtArenaAllocator, OrtMemTypeDefault, &sMem);
            if (st) {
                ort->ReleaseStatus(st);
                sMem = NULL;
            }
        }
    });
    return sMem;
}

static BOOL cpCheckStatus(const OrtApi *ort, OrtStatus *status, NSError * _Nullable * _Nullable error) {
    if (!status) {
        return YES;
    }
    const char *cmsg = ort->GetErrorMessage(status);
    NSString *msg = cmsg ? [NSString stringWithUTF8String:cmsg] : @"ONNX Runtime C API error";
    ort->ReleaseStatus(status);
    if (error) {
        *error = [NSError errorWithDomain:@"ChanhPhapOrtSession"
                                     code:500
                                 userInfo:@{NSLocalizedDescriptionKey: msg}];
    }
    return NO;
}
#endif

+ (BOOL)isRuntimeAvailable {
#if CP_HAS_ORT_C
    return cpSharedOrtApi() != NULL;
#else
    return NO;
#endif
}

- (nullable instancetype)initWithModelPath:(NSString *)modelPath
                              intraThreads:(int)intraThreads
                                     error:(NSError * _Nullable * _Nullable)error {
    self = [super init];
    if (!self) return nil;

#if CP_HAS_ORT_C
    _ort = cpSharedOrtApi();
    if (!_ort) {
        if (error) {
            *error = [NSError errorWithDomain:@"ChanhPhapOrtSession"
                                         code:501
                                     userInfo:@{NSLocalizedDescriptionKey: @"Không nạp được ONNX Runtime C API."}];
        }
        return nil;
    }

    OrtEnv *env = cpSharedOrtEnv(_ort);
    if (!env) {
        if (error) {
            *error = [NSError errorWithDomain:@"ChanhPhapOrtSession"
                                         code:502
                                     userInfo:@{NSLocalizedDescriptionKey: @"Không khởi tạo được môi trường ONNX."}];
        }
        return nil;
    }

    OrtSessionOptions *opts = NULL;
    if (!cpCheckStatus(_ort, _ort->CreateSessionOptions(&opts), error)) {
        return nil;
    }
    (void)cpCheckStatus(_ort, _ort->SetIntraOpNumThreads(opts, intraThreads > 0 ? intraThreads : 2), NULL);
    (void)cpCheckStatus(_ort, _ort->SetSessionGraphOptimizationLevel(opts, ORT_ENABLE_ALL), NULL);

    OrtStatus *sessSt = _ort->CreateSession(env, [modelPath fileSystemRepresentation], opts, &_session);
    _ort->ReleaseSessionOptions(opts);
    if (!cpCheckStatus(_ort, sessSt, error) || !_session) {
        return nil;
    }

    OrtAllocator *alloc = NULL;
    if (cpCheckStatus(_ort, _ort->GetAllocatorWithDefaultOptions(&alloc), error) && alloc) {
        char *outNameC = NULL;
        if (cpCheckStatus(_ort, _ort->SessionGetOutputName(_session, 0, alloc, &outNameC), error) && outNameC) {
            _firstOutputName = [NSString stringWithUTF8String:outNameC];
            (void)cpCheckStatus(_ort, _ort->AllocatorFree(alloc, outNameC), NULL);
        }
    }
    if (!_firstOutputName) {
        _ort->ReleaseSession(_session);
        _session = NULL;
        return nil;
    }
    return self;
#else
    if (error) {
        *error = [NSError errorWithDomain:@"ChanhPhapOrtSession"
                                     code:501
                                 userInfo:@{NSLocalizedDescriptionKey: @"ONNX Runtime C headers chưa được liên kết."}];
    }
    return nil;
#endif
}

- (void)dealloc {
#if CP_HAS_ORT_C
    if (_ort && _session) {
        _ort->ReleaseSession(_session);
        _session = NULL;
    }
#endif
}

- (nullable ChanhPhapOrtTensor *)runFirstOutputWithInputs:(NSDictionary<NSString *, ChanhPhapOrtTensor *> *)inputs
                                                    error:(NSError * _Nullable * _Nullable)error {
#if CP_HAS_ORT_C
    if (!_ort || !_session || !_firstOutputName) {
        return nil;
    }
    OrtMemoryInfo *memInfo = cpSharedCpuMemoryInfo(_ort);
    if (!memInfo) {
        return nil;
    }

    NSArray<NSString *> *keys = [inputs allKeys];
    size_t inputCount = (size_t)[keys count];
    if (inputCount == 0) {
        return nil;
    }

    const char **inputNames = (const char **)calloc(inputCount, sizeof(const char *));
    OrtValue **inputValues = (OrtValue **)calloc(inputCount, sizeof(OrtValue *));
    NSMutableArray<NSMutableData *> *pinnedBuffers = [NSMutableArray arrayWithCapacity:inputCount];

    BOOL ok = YES;
    for (size_t i = 0; i < inputCount; i++) {
        NSString *name = keys[i];
        ChanhPhapOrtTensor *tensor = inputs[name];
        inputNames[i] = [name UTF8String];

        NSMutableData *mutableBuf = [NSMutableData dataWithData:tensor.data];
        [pinnedBuffers addObject:mutableBuf];

        size_t rank = (size_t)[tensor.shape count];
        int64_t shapeStack[8];
        int64_t *shapePtr = rank <= 8 ? shapeStack : (int64_t *)calloc(rank, sizeof(int64_t));
        for (size_t d = 0; d < rank; d++) {
            shapePtr[d] = [tensor.shape[d] longLongValue];
        }

        ONNXTensorElementDataType ortType = ONNX_TENSOR_ELEMENT_DATA_TYPE_FLOAT;
        if (tensor.dtype == ChanhPhapOrtDTypeInt64) {
            ortType = ONNX_TENSOR_ELEMENT_DATA_TYPE_INT64;
        } else if (tensor.dtype == ChanhPhapOrtDTypeBool8) {
            ortType = ONNX_TENSOR_ELEMENT_DATA_TYPE_BOOL;
        }

        OrtValue *val = NULL;
        OrtStatus *st = _ort->CreateTensorWithDataAsOrtValue(
            memInfo,
            [mutableBuf mutableBytes],
            (size_t)[mutableBuf length],
            shapePtr,
            rank,
            ortType,
            &val
        );
        if (shapePtr != shapeStack) {
            free(shapePtr);
        }
        if (!cpCheckStatus(_ort, st, error) || !val) {
            ok = NO;
            break;
        }
        inputValues[i] = val;
    }

    ChanhPhapOrtTensor *resultTensor = nil;
    if (ok) {
        const char *outNameC = [_firstOutputName UTF8String];
        OrtValue *outVal = NULL;
        OrtStatus *runSt = _ort->Run(
            _session,
            NULL,
            inputNames,
            (const OrtValue * const *)inputValues,
            inputCount,
            &outNameC,
            1,
            &outVal
        );
        if (cpCheckStatus(_ort, runSt, error) && outVal) {
            OrtTensorTypeAndShapeInfo *info = NULL;
            if (cpCheckStatus(_ort, _ort->GetTensorTypeAndShape(outVal, &info), error) && info) {
                size_t dimCount = 0;
                size_t elemCount = 0;
                (void)cpCheckStatus(_ort, _ort->GetDimensionsCount(info, &dimCount), NULL);
                (void)cpCheckStatus(_ort, _ort->GetTensorShapeElementCount(info, &elemCount), NULL);

                NSMutableArray<NSNumber *> *outShape = [NSMutableArray arrayWithCapacity:dimCount];
                if (dimCount > 0) {
                    int64_t *dims = (int64_t *)calloc(dimCount, sizeof(int64_t));
                    if (cpCheckStatus(_ort, _ort->GetDimensions(info, dims, dimCount), NULL)) {
                        for (size_t d = 0; d < dimCount; d++) {
                            [outShape addObject:@(dims[d] > 0 ? dims[d] : 1)];
                        }
                    }
                    free(dims);
                }
                _ort->ReleaseTensorTypeAndShapeInfo(info);

                void *rawOutPtr = NULL;
                if (cpCheckStatus(_ort, _ort->GetTensorMutableData(outVal, &rawOutPtr), error) && rawOutPtr) {
                    NSData *copied = [NSData dataWithBytes:rawOutPtr length:elemCount * sizeof(float)];
                    resultTensor = [[ChanhPhapOrtTensor alloc] initWithData:copied
                                                                     dtype:ChanhPhapOrtDTypeFloat32
                                                                     shape:outShape];
                }
            }
            _ort->ReleaseValue(outVal);
        }
    }

    for (size_t i = 0; i < inputCount; i++) {
        if (inputValues[i]) {
            _ort->ReleaseValue(inputValues[i]);
        }
    }
    free(inputValues);
    free(inputNames);
    [pinnedBuffers removeAllObjects];

    return resultTensor;
#else
    if (error) {
        *error = [NSError errorWithDomain:@"ChanhPhapOrtSession"
                                     code:501
                                 userInfo:@{NSLocalizedDescriptionKey: @"ONNX Runtime C chưa khả dụng."}];
    }
    return nil;
#endif
}

@end
