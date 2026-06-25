{ pkgs, ... }: {
  packages = [ pkgs.nodejs_22 ];

  idx.extensions = [
    "11ty.11ty-vscode"
    "esbenp.prettier-vscode"
    "dbaeumer.vscode-eslint"
  ];

  idx.workspace = {
    onCreate.after = [ "npm ci" ];
  };

  processes = {
    dev = "npm run dev";
  };
}
