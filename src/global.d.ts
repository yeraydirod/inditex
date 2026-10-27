declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare const process: {
  env: {
    CORS_PROXY_URL?: string;
  };
};
