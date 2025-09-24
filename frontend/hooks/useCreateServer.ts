import useSWRMutation from "swr/mutation";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

async function createServerRequest(
  url: string,
  { arg }: { arg: { formData: FormData; accessToken: string } }
) {
  const { accessToken, formData } = arg;
  console.log("accessToken", accessToken, "formData", formData);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create server.");
  }

  return res.json();
}

export const useCreateServer = () => {
  const mutationKey = `${BACKEND_URI}/api/v1/server/create-server`;

  const { trigger, isMutating, error, data } = useSWRMutation(
    mutationKey,
    createServerRequest
  );

  return {
    createServer: trigger,
    isCreating: isMutating,
    error,
    data,
  };
};
