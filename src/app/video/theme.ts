import type { ThemeConfig } from "antd";

export const videoWorkspaceTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2563eb",
    colorBgBase: "#f5f7fa",
    colorBgLayout: "#f5f7fa",
    colorBgContainer: "#ffffff",
    colorBorder: "#e5e7eb",
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    borderRadius: 12,
    controlHeight: 34,
    fontSize: 14,
    fontFamily: "\"IBM Plex Sans\", \"Noto Sans SC\", \"PingFang SC\", sans-serif",
  },
  components: {
    Card: {
      borderRadiusLG: 12,
      headerHeight: 44,
    },
    Menu: {
      itemBorderRadius: 10,
      itemHeight: 38,
      itemHoverBg: "#eff6ff",
      itemSelectedBg: "#dbeafe",
      itemSelectedColor: "#1d4ed8",
    },
    Segmented: {
      itemSelectedBg: "#dbeafe",
      itemSelectedColor: "#1d4ed8",
      trackBg: "#f8fafc",
    },
    Steps: {
      titleLineHeight: 18,
      descriptionMaxWidth: 180,
    },
  },
};
