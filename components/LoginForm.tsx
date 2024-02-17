import Link from "next/link";
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

  const handleSignInGoogle = async (e) => {
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
      <div className="flex flex-col items-center justify-center px-3 py-8 mx-auto h-screen lg:py-0">
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
          <div className="flex justify-center items-center">
            <img src="icon-512.png" alt="icon" width={120} height={120} />
          </div>
          <h2 className="flex justify-center items-center pt-5 text-2xl">
            YouOke App
          </h2>
          <form action="" className="group" onSubmit={handleLogin}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="valid:[&:not(:placeholder-shown)]:border-gray-300[&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-300focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                autoComplete="off"
                required
                pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder="name@gmail.com"
                onChange={(e: any) => {
                  setData({
                    ...data,
                    email: e.target.value,
                  });
                }}
              />
              <span className="mt-1 hidden text-sm text-red-400">
                โปรดใส่อีเมล
              </span>
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                รหัสผ่าน
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="valid:[&:not(:placeholder-shown)]:border-gray-300[&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-300focus:outline-none focus:ring-primary dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                required
                onChange={(e: any) => {
                  setData({
                    ...data,
                    password: e.target.value,
                  });
                }}
              />
              <span className="text-xs text-gray-400">
                <Link href="fogot-password">
                  <a className="text-pink-500 hover:link">ลืมรหัสผ่าน?</a>
                </Link>
              </span>
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary mb-2 mt-1 w-full rounded-lg px-5 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100  disabled:text-gray-400 group-invalid:pointer-events-none group-invalid:bg-gray-100 group-invalid:text-gray-400 group-invalid:opacity-70"
            >
              เข้าสู่ระบบ
            </button>
            <span className="text-xs text-gray-400">
              ยังไม่มีบัญชีใช่ไหม?{" "}
              <Link href="register">
                <a className="text-pink-500 hover:link">ลงทะเบียน</a>
              </Link>
            </span>
          </form>
          <div className="divider"> หรือ </div>
          <div className="flex items-center justify-center  dark:bg-gray-800">
            <button
              onClick={handleSignInGoogle}
              className="px-4 py-2 border w-full text-center justify-center  flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-200 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
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
          <Link href="/">
            <a className="text-gray-400 hover:link text-xs float-right pt-2">
              ข้ามการเข้าสู่ระบบ
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
