import Head from "next/head";

import ForgotForm from "../components/ForgotForm";

export default function Register() {
  return (
    <>
      <Head>
        <title>ลืมรหัสผ่าน - YouOke - คาราโอเกะออนไลน์บน YouTube</title>
      </Head>
      <main className="m-0 bg-gradient-to-br from-primary-color to-blue-400 px-4">
        <ForgotForm />
      </main>
    </>
  );
}
