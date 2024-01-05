"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../_providers/Auth";
import { useForm } from "react-hook-form";
import {
  auth,
  updateProfile,
} from "../../../../../payload/utilities/firebase-config";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pengaturan | PondPedia",
  description: "Halaman pengaturan profile",
  // other metadata
};

type FormData = {
  name: string | undefined;
  username: string;
  profile_picture: string;
};

const ProfilePage: React.FC = () => {
  const [success, setSuccess] = useState("");
  const [successPicture, setSuccessPicture] = useState("");
  const [error, setError] = useState("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState("");
  const [errorPicture, setErrorPicture] = useState("");
  const { user, setUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<FormData>();

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${user.id}`,
          {
            // Make sure to include cookies with fetch
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        updateProfile(auth.currentUser!, {
          displayName: data.name,
        });

        if (response.ok) {
          const json = await response.json();
          setUser(json.doc);
          setSuccess("Berhasil diperbarui!");
          setError("");
          reset({
            name: json.doc.name,
            username: json.doc.username,
          });
        } else {
          setError("Gagal diperbarui!");
        }
      }
    },
    [user, setUser, reset],
  );

  const profilePictureSubmit = useCallback(
    async (data: FormData) => {
      const file: Blob = new Blob([data.profile_picture[0]], {
        type: "image/jpeg",
      });
      const firebaseUser = auth.currentUser!;
      const userId = user?.id;
      const storageRef = ref(
        getStorage(),
        `/users/profilePictures/${userId}/${user?.name}'s Avatar.` +
          file.type.split("/").pop(),
      );

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded file
        const url = await getDownloadURL(storageRef);

        console.log(url)

        // Update the user's profile with the photo URL
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${userId}`, {
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify({
              profile_picture: url,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
          updateProfile(firebaseUser, {
            photoURL: url,
          }),
        ]);

        setSuccessPicture("Berhasil diperbarui!");
      } catch (error) {
        setErrorPicture(`Gagal diperbarui!`);
      }
    },
    [user],
  );

  const handleProfilePictureChange = (event) => {
    setSelectedProfilePicture(URL.createObjectURL(event.target.files[0]));
  };

  useEffect(() => {
    if (user === null) {
      router.push(`/login?unauthorized=account`);
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      reset({
        name: user.name || undefined,
        username: user.username,
        profile_picture: user.profile_picture || undefined,
      });
    }
  }, [user, router, reset]);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Pengaturan" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3
                  className={`font-medium text-black dark:text-white ${
                    success ? "text-green-500" : ""
                  } ${error ? "text-red-500" : ""}`}
                >
                  Profil Pengguna {success ? success : error}
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-5.5 w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        placeholder="Masukkan nama anda"
                        {...register("name")}
                        id="name"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        placeholder="Masukkan nama anda"
                        {...register("username", { required: true })}
                        id="username"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => reset()}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-95"
                      type="submit"
                      disabled={isSubmitting || !isDirty}
                    >
                      {isSubmitting ? "Loading..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3
                  className={`font-medium text-black dark:text-white ${
                    successPicture ? "text-green-500" : ""
                  } ${errorPicture ? "text-red-500" : ""}`}
                >
                  Foto Profil {successPicture ? successPicture : errorPicture}
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit(profilePictureSubmit)}>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      {...register("profile_picture")}
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    Choose your image
                  </div>

                  {selectedProfilePicture && (
                    <img
                      src={selectedProfilePicture}
                      alt="Profile Picture Preview"
                      className="h-auto w-full"
                    />
                  )}

                  {/* <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14">
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div> */}

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-95"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Loading..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
