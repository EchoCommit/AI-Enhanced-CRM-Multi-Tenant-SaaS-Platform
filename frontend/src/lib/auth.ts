import { User } from "@/types";

export interface LoginParams {
  email: string;
  password: string;
  tenantSubdomain: string;
}

export interface SignupParams {
  name: string;
  email: string;
  password: string;
  orgName: string;
}

export interface VerifyMfaParams {
  mfa_token: string;
  code: string;
}

export type LoginApiResponse =
  | {
      mfa_required?: false;
      access_token: string;
      user: User;
    }
  | {
      mfa_required: true;
      mfa_token: string;
      access_token?: never;
      user?: never;
    };

export interface AuthSuccessResponse {
  access_token: string;
  user: User;
}

/**
 * Stubbed API call simulating POST /auth/login
 * API contract: Returns { access_token, user } OR { mfa_required, mfa_token }
 */
export async function loginApi(params: LoginParams): Promise<LoginApiResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { email, password, tenantSubdomain } = params;

  // Validation rules for stub:
  if (password === "invalid" || password === "wrong") {
    throw new Error("Invalid email, password, or tenant subdomain.");
  }

  // Simulate MFA challenge if email contains "mfa"
  if (email.toLowerCase().includes("mfa")) {
    return {
      mfa_required: true,
      mfa_token: `mfa_token_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  const tenantId = `tenant-${tenantSubdomain.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ sub: email, tenant: tenantId, exp: Date.now() + 3600000 })
  )}.signature`;

  return {
    access_token: mockToken,
    user: {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name: email.split("@")[0].replace(".", " "),
      role: "admin",
      tenantId,
    },
  };
}

/**
 * Stubbed API call simulating POST /auth/mfa/verify
 */
export async function verifyMfaApi(params: VerifyMfaParams): Promise<AuthSuccessResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { code } = params;
  if (code.trim() !== "123456" && code.trim() !== "000000") {
    throw new Error("Invalid MFA code. Try using test code: 123456");
  }

  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mfa_verified.${Date.now()}`;

  return {
    access_token: mockToken,
    user: {
      id: `usr_mfa_${Math.random().toString(36).substring(2, 9)}`,
      email: "mfa.user@nexus-crm.io",
      name: "MFA Verified User",
      role: "admin",
      tenantId: "tenant-demo",
    },
  };
}

/**
 * Stubbed API call simulating POST /auth/signup
 */
export async function signupApi(params: SignupParams): Promise<AuthSuccessResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const { name, email, orgName } = params;

  if (email.toLowerCase().includes("taken")) {
    throw new Error("An account with this email already exists.");
  }

  const tenantId = `tenant-${orgName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.signup.${Date.now()}`;

  return {
    access_token: mockToken,
    user: {
      id: `usr_new_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      role: "admin",
      tenantId,
    },
  };
}
