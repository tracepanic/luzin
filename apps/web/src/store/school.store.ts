import { School } from "@/schemas/schools";
import { create } from "zustand";

interface SchoolState {
  school: School | null;
  isUpdating: boolean;
}

interface SchoolAction {
  setSchool: (school: School | null) => void;
  setIsUpdating: (isUpdating: boolean) => void;
}

const useSchoolStore = create<SchoolState & SchoolAction>((set) => ({
  school: null,
  isUpdating: false,
  setSchool: (school) => set({ school }),
  setIsUpdating: (isUpdating) => set({ isUpdating }),
}));

export { useSchoolStore };
