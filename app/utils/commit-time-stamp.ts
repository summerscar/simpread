import { execSync } from "child_process";

let getCommitTimeStamp = () => {
  const commitTimeStamp = execSync("git log -1 --format=%ct");
  const COMMIT_TIME_STAMP = Number(commitTimeStamp.toString().trim()) * 1000;
  getCommitTimeStamp = () => COMMIT_TIME_STAMP;
  return COMMIT_TIME_STAMP;
};

export { getCommitTimeStamp };
