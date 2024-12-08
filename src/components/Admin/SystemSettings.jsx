import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from '../ui/use-toast';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    commissionRate: 8,
    placementFee: 20,
    maintenanceMode: false,
    autoBackup: true,
    notificationsEnabled: true
  });

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    toast({
      title: "Success",
      description: "Settings updated successfully"
    });
  };

  const toggleMaintenanceMode = () => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
    toast({
      title: prev => prev.maintenanceMode ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
      description: prev => prev.maintenanceMode 
        ? "System is now accessible to all users" 
        : "System is now in maintenance mode"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Commission Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Commission Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Commission Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                  className="max-w-[200px]"
                />
              </div>
              <div>
                <Label>Default Placement Fee (%)</Label>
                <Input
                  type="number"
                  value={settings.placementFee}
                  onChange={(e) => setSettings({ ...settings, placementFee: e.target.value })}
                  className="max-w-[200px]"
                />
              </div>
            </div>
          </div>

          {/* System Maintenance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">
                    When enabled, only administrators can access the system
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => {
                    toggleMaintenanceMode();
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-gray-500">
                    Automatically backup system data daily
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label>System Notifications</Label>
                <p className="text-sm text-gray-500">
                  Enable/disable system-wide notifications
                </p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                }
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
