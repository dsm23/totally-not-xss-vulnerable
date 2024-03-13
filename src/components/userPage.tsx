import { Link, useParams } from "react-router-dom";
import { GoBack } from "./svgs/goBack";
import { User as UserSVG } from "./svgs/user";

const User = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <main className="main mx-auto mt-20 max-w-5xl">
      <div className="ml-20">
        <Link to="/">
          <GoBack className="h-10 w-10 transform rounded-full bg-gray-100 p-2 text-green-800 outline-none transition duration-500 ease-in-out hover:scale-125 hover:bg-green-900 hover:text-white focus:border-2 focus:border-yellow-500" />
        </Link>
      </div>
      <div className="flex">
        <div className="mt-4 mr-4 flex-shrink-0 self-center">
          <UserSVG className="h-16 w-16 bg-white text-gray-300" />
        </div>
        <div>
          <h1
            className="mt-4 text-lg font-bold"
            dangerouslySetInnerHTML={{
              // __html: decodeURI(username),
              // __html:
              // '<script defer type="text/javascript">console.log("Hello, World!")</' +
              // "script>",
              __html: username as string,
            }}
          />
          <p className="mt-1">example description</p>
        </div>
      </div>
    </main>
  );
};

export { User };
