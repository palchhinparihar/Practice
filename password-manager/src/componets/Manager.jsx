import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();

  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }
  }, []);

  const copyText = (text) => {
    toast('Copied to clipboard!', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    
    navigator.clipboard.writeText(text);
  }
  
  const showPassword = () => {
    if (ref.current.src.includes("icons/eye.png")) {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "text";
    }
    else {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "password";
    }
  }

  const savePassword = () => {
    if (form.site.length > 5 && form.username.length > 5 && form.password.length > 5) {
      setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
      localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));

      setForm({ site: "", username: "", password: "" });

      toast.success('Saved password successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else {
      toast.error('Cannot saved the password!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const editPassword = (id) => {
    setForm(passwordArray.filter(item => item.id === id)[0]);
    setPasswordArray(passwordArray.filter(item => item.id !== id));
  }

  const deletePassword = (id) => {
    if(confirm('Do you really want to delete this password?')) {
      setPasswordArray(passwordArray.filter(item => item.id !== id));
      localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)));

      toast.success('Deleted password successfully!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }
  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <section className="min-h-[81.8vh] md:min-h-[90.3vh] lg:min-h-[84.5vh]">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-3/4 w-3/4 rounded-full bg-blue-300 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-5 pb-3">
          <div className="md:pt-10 pt-5 pb-5">
              <h1 className="font-bold text-3xl text-center mb-[2px]">
              <span className="text-blue-700">&lt;</span>
              <span className="font-serif">Pass</span>
              <span className="text-blue-700">M/&gt;</span>
              </h1>
              <p className="font-semibold text-lg text-blue-800 text-center">Your Personal Password Manager</p>
          </div>

          <div className="flex flex-col gap-5 w-full items-center">
              <input autoFocus autoComplete="off" value={ form.site } name="site" onChange={ handleChange } className="w-full rounded-full border border-blue-700 text-black py-1 px-5" type="text" placeholder="Enter website URL" id="site" />

              <div className="flex md:flex-row flex-col w-full md:gap-10 gap-5 justify-between">
                  <input autoComplete="off" value={ form.username } name="username" onChange={ handleChange } className="w-full rounded-full border border-blue-700 text-black py-1 px-5" type="text" placeholder="Enter username" id="username" />
                  <div className="flex justify-between relative w-full">
                    <input autoComplete="off" ref={ passwordRef } value={ form.password } name="password" onChange={ handleChange } className="w-full rounded-full border border-blue-700 text-black py-1 px-5" type="password" placeholder="Enter password" id="password" />
                    <img ref={ ref } onClick={ showPassword } className="absolute bottom-[5px] right-3" width={ 22 } src="icons/eye.png" alt="eye" />
                  </div>
              </div>

              <button onClick={ savePassword } className="bg-blue-400 rounded-full flex justify-center items-center gap-2 py-1 px-8 border border-blue-800 hover:bg-blue-300 hover:font-bold md:mt-2">
                <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                <span>Save</span>
              </button>
          </div>

          <div className="passwords">
            <h2 className="font-bold text-2xl mt-8 mb-4">Your Passwords</h2>

            {passwordArray.length === 0 && (
              <div className="font-semibold md:text-[17px] text-sm bg-gray-200 md:py-3 px-3 py-1 flex items-center gap-1">
                <span className="pt-[1px]">No passwords to show! Add passwords.</span>
                <img className="w-7" src="/icons/password.png" alt="Password" />
              </div>
            )}

            {passwordArray.length !== 0 && (
              <div className="overflow-x-auto">
                <table className="table-auto w-full rounded-md overflow-hidden">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="text-center py-2 w-1/4">Site</th>
                      <th className="text-center py-2 w-1/4">Username</th>
                      <th className="text-center py-2 w-1/4">Password</th>
                      <th className="text-center py-2 w-1/12">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-blue-100">
                    {passwordArray.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="py-2 border border-white text-center">
                            <div className="flex justify-center gap-2 px-2 md:px-0">
                              <a href={item.site} target="_blank" rel="noopener noreferrer">
                                <span className="truncate">{item.site}</span>
                              </a>
                              <div className="lordiconcopy cursor-pointer" onClick={() => copyText(item.site)}>
                                <lord-icon
                                  style={{ width: "27px", height: "27px", paddingTop: "1px" }}
                                  src="https://cdn.lordicon.com/iykgtsbt.json"
                                  trigger="hover"
                                ></lord-icon>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 border border-white text-center">
                            <div className="flex justify-center gap-2 px-2 md:px-0">
                              <span className="truncate">{item.username}</span>
                              <div className="lordiconcopy cursor-pointer" onClick={() => copyText(item.username)}>
                                <lord-icon
                                  style={{ width: "27px", height: "27px", paddingTop: "1px" }}
                                  src="https://cdn.lordicon.com/iykgtsbt.json"
                                  trigger="hover"
                                ></lord-icon>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 border border-white text-center">
                            <div className="flex justify-center gap-2 px-2 md:px-0">
                              <span className="truncate">{"*".repeat(item.password.length)}</span>
                              <div className="lordiconcopy cursor-pointer" onClick={() => copyText(item.password)}>
                                <lord-icon
                                  style={{ width: "27px", height: "27px", paddingTop: "1px" }}
                                  src="https://cdn.lordicon.com/iykgtsbt.json"
                                  trigger="hover"
                                ></lord-icon>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 border border-white text-center">
                            <div className="flex px-2 justify-center md:px-0">
                              <span className="edit-button cursor-pointer mr-1" onClick={() => editPassword(item.id)}>
                                <lord-icon
                                  src="https://cdn.lordicon.com/gwlusjdu.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                ></lord-icon>
                              </span>
                              <span className="delete-button cursor-pointer" onClick={() => deletePassword(item.id)}>
                                <lord-icon
                                  src="https://cdn.lordicon.com/skkahier.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                ></lord-icon>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Manager;
