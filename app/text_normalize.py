"""Text normalization shared by search and index builders."""
import unicodedata


def normalize(value):
    return ''.join(c for c in unicodedata.normalize('NFD', value.lower().replace('đ', 'd'))
                   if not unicodedata.combining(c))
