/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare module "*.module.scss" {
  let styles: {
    readonly [key: string]: string;
  };
  export default styles;
}

interface Window {
  ENV: {
    readonly COMMIT_TIME?: number;
  };
}
