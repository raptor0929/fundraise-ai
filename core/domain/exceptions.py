# core/domain/exceptions.py

class InvalidDocumentError(Exception):
    """
    Custom exception raised when the content of a document
    does not appear to be a valid, specific pitch deck.
    This is often triggered when the content is a template or guide.
    """
    pass