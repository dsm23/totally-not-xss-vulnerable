import { Link, useParams } from "react-router-dom";

import "twin.macro";
import { GoBack } from "./svgs/goBack";
import { User as UserSVG } from "./svgs/user";

const User = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <main tw="max-w-5xl mx-auto mt-20" className="main">
      <div tw="ml-20">
        <Link to="/">
          <GoBack tw="transition transform duration-500 ease-in-out w-10 h-10 p-2 rounded-full outline-none text-green-800 bg-gray-100 hover:(bg-green-900 text-white scale-125) focus:(border-2 border-yellow-500)" />
        </Link>
      </div>
      <div tw="flex">
        <div tw="mt-4 mr-4 flex-shrink-0 self-center">
          <UserSVG tw="h-16 w-16 bg-white text-gray-300" />
        </div>
        <div>
          <h1
            tw="text-lg font-bold mt-4"
            dangerouslySetInnerHTML={{
              // __html: decodeURI(username),
              // __html:
              // '<script defer type="text/javascript">console.log("Hello, World!")</' +
              // "script>",
              __html: username,
            }}
          />
          <p tw="mt-1">example description</p>
        </div>
      </div>
    </main>
  );
};

export { User };
