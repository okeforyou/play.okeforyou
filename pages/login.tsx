import Head from "next/head";
import { useRouter } from "next/router";

import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (!!user.uid) {
    router.replace("/");
  }

  return (
    <>
      <Head>
        <title>Login - YouOke - คาราโอเกะออนไลน์บน YouTube</title>
        <meta
          property="og:description"
          content="คาราโอเกะออนไลน์ฟรี ไม่ต้องติดตั้ง ทำงานโดยตรงในเบราว์เซอร์ ใช้ได้กับอุปกรณ์หลากหลาย ฐานข้อมูลเพลงจาก Youtube ครบถ้วนและมีคุณภาพสูง 
          "
        />
      </Head>
      <main className="m-0 bg-gradient-to-br from-primary-color to-blue-400 px-4">
        <LoginForm />
      </main>
    </>
  );
}
