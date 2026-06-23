// app/index.tsx

import { Redirect } from "expo-router";

export default function Index() {
  //   const user = useUserStore();

  //   if (!user) {
  //     return <Redirect href="/(auth)/login" />;
  //   }

  //   if (user.role === 'parent') {
  //     return <Redirect href="/(parent)" />;
  //   }

  return <Redirect href="/(auth)/parent-login" />;
}
