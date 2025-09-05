// src/utils/notifications.ts
import { toast } from "sonner-native";

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
  });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-center",

  });
};

export const notifyInfo = (message: string) => {
  toast.info(message, {
    position: "top-center",
    
  });
};


