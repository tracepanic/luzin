import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSchoolInfo } from "@/server/school";
import { useSchoolStore } from "@/store/school.store";

function useSchoolData() {
  const { setSchool, setIsUpdating } = useSchoolStore();

  const { data, isLoading } = useQuery({
    queryKey: ["school-info"],
    queryFn: getSchoolInfo,
    meta: { showError: true },
  });

  useEffect(() => {
    if (isLoading) {
      setIsUpdating(true);
    } else {
      setIsUpdating(false);
      if (data) {
        setSchool(data);
      }
    }
  }, [isLoading, data, setIsUpdating, setSchool]);
}

export { useSchoolData };
