"use client";

import type { ReactNode } from 'react';
import { useState } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      <div className="mx-auto max-w-screen-md">
        <header className="border-b border-gray-300">
          <div className="flex items-center justify-between py-4">
            <div>
              <img className="mivozlogo" src="/mivoz-talk-logo.png" />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowApiKeyManager((prev) => !prev)}
                className="ml-4 w-full rounded-md bg-gray-200 py-2 px-3 text-sm font-medium text-black hover:bg-gray-300"
              >
                <span className="flex w-full">
                  {/* <FontAwesomeIcon icon={faKey} className="mr-2 w-4" /> */}
                  
                  
                  Api Key
                </span>
              </button>
            </div>
            {showApiKeyManager && (
              <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
            )}
            {showApiKeyManager && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white py-5 px-6">
                {/* <ApiKeyInput onClose={() => setShowApiKeyManager(false)} /> */}
              </div>
            )}
          </div>
        </header>

        <main className="content text-xl">{props.children}</main>
      </div>
    </div>
  );
};

export default Main;