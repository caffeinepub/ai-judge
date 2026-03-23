import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type CaseId = bigint;
export interface ConflictCase {
    id: CaseId;
    status: CaseStatus;
    title: string;
    owner: UserId;
    description: string;
    timestamp: bigint;
    otherPartyDescription?: string;
}
export interface Verdict {
    party2FaultPercentage: bigint;
    verdictStatement: string;
    party1FaultPercentage: bigint;
    recommendedSolution: string;
    party1Advice: Array<string>;
    caseId: CaseId;
    party2Advice: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum CaseStatus {
    pending = "pending",
    analyzed = "analyzed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeCase(caseId: CaseId): Promise<Verdict>;
    analyzeCaseAnonymous(description: string, otherPartyDescription: string | null): Promise<Verdict>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserCases(): Promise<Array<[ConflictCase, Verdict | null]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCase(title: string, description: string, otherPartyDescription: string | null): Promise<CaseId>;
}
