import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = <T>(url: string, key: string) => {
  const { data, error, isLoading } = useQuery<T, Error>({
    queryKey: [key],
    queryFn: () => axios.get<T>(url).then((res) => res.data),
  });
  return {
    data,
    error,
    isLoading,
  };
};
export default useModels;
