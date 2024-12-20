import React from 'react';

const About = () => {
  return (
    <main>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-3/4 w-3/4 rounded-full bg-blue-300 opacity-20 blur-[100px]"></div>
      </div>

      <div className="min-h-[81.8vh] md:min-h-[90.3vh] lg:min-h-[84.5vh] flex items-center justify-center p-5">
        <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-4">
            <span className="pr-2">About</span>
            <span>&lt;</span>
            <span>Pass</span>
            <span>M/&gt;</span>
          </h1>
          <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
            <span className="font-semibold">PassM </span>
            <span>
              is your ultimate password management solution, designed to simplify
              your digital life. It allows you to securely store, manage, and retrieve
              your passwords, ensuring your online accounts are safe and easily accessible.
            </span>
          </p>
          <p className="text-gray-700 md:text-lg leading-relaxed text-justify">
            With a sleek and user-friendly interface, <span className="font-semibold">PassM</span> empowers you to:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-sm md:text-lg mt-4 pl-3 text-justify">
            <li>Save passwords for multiple websites and accounts.</li>
            <li>Retrieve your credentials quickly and securely.</li>
            <li>Keep your sensitive information encrypted and private.</li>
          </ul>

          <div className="mt-6 text-justify">
            <p className="text-gray-700 text-sm md:text-lg leading-relaxed mb-3">
              If you have any questions, suggestions, or need assistance, feel free to reach out. I'm always happy to help and value your feedback.
            </p>
            <div className="flex justify-center">
              <button className="connection bg-blue-100 rounded-full px-4 py-1 hover:bg-blue-300 font-semibold hover:font-bold ring-slate-500 ring-1">
                <a className="flex items-center gap-2" href="mailto:palchhinparihar@gmail.com">
                  <img width={ 30 } src="/icons/mail.png" alt="Gmail" />
                  <span>Email</span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
