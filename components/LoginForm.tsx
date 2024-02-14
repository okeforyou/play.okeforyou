import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import { LoginType } from "../types/AuthTypes";
import Alert, { AlertHandler } from "./Alert";

const LoginForm = () => {
  const [data, setData] = useState<LoginType>({
    email: "",
    password: "",
  });

  // Use the signIn method from the AuthContext
  const { logIn, googleSignIn } = useAuth();
  const router = useRouter();
  const errRef = useRef<AlertHandler>(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await logIn(data.email, data.password);
      router.push("/");
    } catch (error: any) {
      errRef?.current.open();
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      router.push("/");
    } catch (error: any) {
      errRef?.current.open();
    }
  };

  // Destructure data from the data object
  const { ...allData } = data;

  // Disable submit button until all fields are filled in
  const canSubmit = [...Object.values(allData)].every(Boolean);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 py-8 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6 sm:py-10 md:p-8 md:py-14">
          <Alert
            ref={errRef}
            timer={2500}
            headline="Error"
            headlineColor="text-red-600"
            bgColor="bg-red-100"
            content={<span className="text-sm">เข้าสู่ระบบไม่สำเร็จ</span>}
            icon={<ExclamationCircleIcon />}
          />

          <form action="" className="group">
            <div className="flex justify-center items-center">
              <img src="icon-512.png" alt="icon" width={120} height={120} />
            </div>
            <h2 className="flex justify-center items-center pt-5 text-2xl">
              Oke for You App
            </h2>
            <div className="flex items-center justify-center  pt-5 dark:bg-gray-800">
              <button
                onClick={handleSignIn}
                className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-200 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
              >
                <img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />
                <span>Login with Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
