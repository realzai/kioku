import os
import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import (
    authenticate_request,
    AuthenticateRequestOptions,
)


def is_signed_in(request: httpx.Request):
    # Log the Authorization header for debugging
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        print("Authorization header is missing")
        return False

    print(f"Authorization header: {auth_header}")

    # Validate the token using Clerk SDK
    sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
    try:
        request_state = sdk.authenticate_request(request, AuthenticateRequestOptions())

        return request_state.is_signed_in
    except Exception as e:
        print(f"Error authenticating request: {e}")
        return False


def get_user_id(request: httpx.Request):
    sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
    try:
        request_state = sdk.authenticate_request(request, AuthenticateRequestOptions())

        return request_state.payload.get("sub")
    except Exception as e:
        print(f"Error authenticating request: {e}")
        return None
