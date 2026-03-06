import type { ThemeConfig } from "antd";

export const videoWorkspaceTheme: ThemeConfig = {
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
    borderRadiusLG: 28,
    controlHeight: 38,
    fontSize: 14,
    fontFamily: "\"IBM Plex Sans\", \"Noto Sans SC\", \"PingFang SC\", sans-serif",
  },
  components: {
    Card: {
      borderRadiusLG: 28,
      headerHeight: 48,
    },
    Menu: {
      itemBorderRadius: 14,
      itemHeight: 40,
      itemHoverBg: "rgba(47,107,95,0.08)",
      itemSelectedBg: "rgba(47,107,95,0.14)",
      itemSelectedColor: "#2f6b5f",
    },
    Segmented: {
      itemSelectedBg: "rgba(255,255,255,0.92)",
      itemSelectedColor: "#2f6b5f",
      trackBg: "rgba(201,139,91,0.10)",
    },
    Steps: {
      titleLineHeight: 18,
      descriptionMaxWidth: 180,
    },
    Button: {
      borderRadius: 16,
      primaryShadow: "0 12px 22px rgba(47,107,95,0.18)",
    },
    Tabs: {
      itemColor: "#6f665c",
      itemSelectedColor: "#2f6b5f",
      inkBarColor: "#2f6b5f",
    },
    Drawer: {
      colorBgElevated: "#fffdf9",
    },
  },
};
