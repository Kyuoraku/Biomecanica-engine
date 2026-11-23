export const deployConfigWithWrongOutput = `
[build]
  command = "npm run build"
  publish = "build"
`;

export const unprotectedBranch = {
  protected: false,
  protection: { enabled: false, required_status_checks: { contexts: [] } },
};

export const protectedBranchWithoutChecks = {
  protected: true,
  protection: { enabled: true, required_status_checks: { contexts: [] } },
};
