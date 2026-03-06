"use client";

import { ConfigProvider, theme, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AntdProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#2f6b5f",
            colorInfo: "#8da7c2",
            colorSuccess: "#4c8b6a",
            colorWarning: "#c98b5b",
            colorError: "#c65a4b",
            colorBgBase: "#f4efe8",
            colorBgLayout: "#f4efe8",
            colorBgContainer: "#fffdf9",
            colorBorder: "#e5ddd2",
            colorText: "#1e1b18",
            colorTextSecondary: "#6f665c",
            borderRadius: 18,
            borderRadiusLG: 26,
            fontFamily: "\"IBM Plex Sans\", \"Noto Sans SC\", \"PingFang SC\", sans-serif",
          },
          components: {
            Card: {
              borderRadiusLG: 26,
            },
            Button: {
              borderRadius: 16,
            },
            Input: {
              borderRadius: 16,
            },
            Drawer: {
              colorBgElevated: "#fffdf9",
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
