#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, ChanhPhapOrtDType) {
    ChanhPhapOrtDTypeFloat32 NS_SWIFT_NAME(float32) = 1,
    ChanhPhapOrtDTypeInt64   NS_SWIFT_NAME(int64)   = 7,
    ChanhPhapOrtDTypeBool8   NS_SWIFT_NAME(bool8)   = 9
};

@interface ChanhPhapOrtTensor : NSObject

@property (nonatomic, readonly) ChanhPhapOrtDType dtype;
@property (nonatomic, readonly) NSArray<NSNumber *> *shape;
@property (nonatomic, readonly) NSData *data;

- (instancetype)initWithData:(NSData *)data
                       dtype:(ChanhPhapOrtDType)dtype
                       shape:(NSArray<NSNumber *> *)shape
    NS_SWIFT_NAME(init(data:dtype:shape:));

@end

@interface ChanhPhapOrtSession : NSObject

+ (BOOL)isRuntimeAvailable NS_SWIFT_NAME(isRuntimeAvailable());

- (nullable instancetype)initWithModelPath:(NSString *)modelPath
                              intraThreads:(int)intraThreads
                                     error:(NSError * _Nullable * _Nullable)error
    NS_SWIFT_NAME(init(modelPath:intraThreads:));

- (nullable ChanhPhapOrtTensor *)runFirstOutputWithInputs:(NSDictionary<NSString *, ChanhPhapOrtTensor *> *)inputs
                                                    error:(NSError * _Nullable * _Nullable)error
    NS_SWIFT_NAME(runFirstOutput(withInputs:));

@end

NS_ASSUME_NONNULL_END
