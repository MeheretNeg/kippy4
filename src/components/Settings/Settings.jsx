import { useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Switch } from '../ui/switch.jsx';
import { cn } from '../../lib/utils';

const RoleCard = ({ role, isActive, onClick }) => (
  <Card 
    as="button"
    onClick={() => onClick(role)}
    className={cn(
      "relative w-full text-left transition-all",
      isActive && "ring-2 ring-primary"
    )}
  >
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className={cn(
          "text-lg",
          isActive && "text-primary"
        )}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </CardTitle>
        <div className={cn(
          "w-4 h-4 rounded-full border-2",
          isActive ? "border-primary bg-primary" : "border-muted-foreground"
        )}>
          {isActive && (
            <div className="w-full h-full rounded-full bg-primary-foreground transform scale-50" />
          )}
        </div>
      </div>
      <CardDescription>
        {getRoleDescription(role)}
      </CardDescription>
    </CardHeader>
  </Card>
);

const SettingsSection = ({ title, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div className="space-y-0.5">
      <div className="text-sm font-medium">{label}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const AccountItem = ({ title, description, action }) => (
  <div className="flex items-center justify-between py-2">
    <div className="space-y-0.5">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">
        {description}
      </div>
    </div>
    <Button variant="outline" size="sm">
      {action}
    </Button>
  </div>
);

const getRoleDescription = (role) => {
  const descriptions = {
    recruiter: "Access to job postings, candidate management, and placement tracking",
    manager: "Team oversight, performance metrics, and strategic planning tools",
    admin: "Full system access, user management, and configuration controls"
  };
  return descriptions[role] || "";
};

const Settings = () => {
  const { userRole, setUserRole } = useContext(UserRoleContext);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
  };

  return (
    <div className="p-8 bg-muted min-h-screen space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <Button>
          Save Changes
        </Button>
      </div>

      <SettingsSection title="Role Selection">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoleCard
            role="recruiter"
            isActive={userRole === 'recruiter'}
            onClick={handleRoleChange}
          />
          <RoleCard
            role="manager"
            isActive={userRole === 'manager'}
            onClick={handleRoleChange}
          />
          <RoleCard
            role="admin"
            isActive={userRole === 'admin'}
            onClick={handleRoleChange}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Preferences">
        <div className="space-y-4">
          <ToggleItem
            label="Email Notifications"
            checked={true}
            onChange={() => {}}
          />
          <ToggleItem
            label="Desktop Notifications"
            checked={false}
            onChange={() => {}}
          />
          <ToggleItem
            label="Weekly Reports"
            checked={true}
            onChange={() => {}}
          />
          <ToggleItem
            label="Dark Mode"
            checked={false}
            onChange={() => {}}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Account">
        <div className="space-y-4">
          <AccountItem
            title="Connected Email"
            description="user@example.com"
            action="Change"
          />
          <AccountItem
            title="Password"
            description="Last changed 3 months ago"
            action="Update"
          />
          <AccountItem
            title="Two-Factor Authentication"
            description="Not enabled"
            action="Enable"
          />
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;