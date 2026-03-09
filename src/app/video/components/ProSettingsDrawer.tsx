"use client";

import { Button, Drawer, Space } from "antd";
import { ProSettingsPanel, type ProSettingsPanelProps } from "./ProSettingsPanel";

export interface ProSettingsDrawerProps extends Omit<ProSettingsPanelProps, "layout" | "active"> {
  open: boolean;
}

export function ProSettingsDrawer({
  open,
  memoryUser,
  config,
  capabilitySkills,
  capabilityMcps,
  onClose,
  onApply,
}: ProSettingsDrawerProps) {
  return (
    <Drawer
      title="专业模式"
      size={720}
      open={open}
      onClose={onClose}
      extra={(
        <Space>
          <Button onClick={onClose}>取消</Button>
        </Space>
      )}
    >
      <ProSettingsPanel
        active={open}
        layout="drawer"
        memoryUser={memoryUser}
        config={config}
        capabilitySkills={capabilitySkills}
        capabilityMcps={capabilityMcps}
        onApply={onApply}
        onClose={onClose}
      />
    </Drawer>
  );
}
