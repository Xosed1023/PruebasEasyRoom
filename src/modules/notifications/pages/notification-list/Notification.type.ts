import Icon from "@/icons";

type IconName = React.ComponentProps<typeof Icon>["name"];

export interface NotificationItem {
  id: string;
  icon: IconName;
  bgColor: string;
  iconColor: string;
  title: string;       
  description: string; 
  date: string;         
  unread: boolean;
}

export interface Props {
  items: NotificationItem[];
  onClickItem?: (item: NotificationItem) => void;
  onMarkRead?: (id: string) => void;
}
