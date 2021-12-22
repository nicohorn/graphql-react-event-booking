import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context'

const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box flex justify-center">
          <div className="px-2 mx-2 navbar-center flex align-middle">
            {context.token ? (
              <NavLink to="/" className="text-lg font-bold">Origen</NavLink>
            ) : (
              <div className="flex gap-2">
                <span className="text-lg font-bold">Origen</span> <h3 className="text-lg">Login</h3>
              </div>
            )}
          </div>
          {context.token && (
            <div className="hidden px-2 mx-2 navbar-center lg:flex">
              <div className="flex gap-6">
                <NavLink
                  className="btn btn-ghost btn-sm rounded-btn"
                  to="/professionals"
                >
                  Professionals
                </NavLink>
                <NavLink
                  className="btn btn-ghost btn-sm rounded-btn"
                  to="/bookings"
                >
                  Bookings
                </NavLink>
                <NavLink
                  className="btn btn-ghost btn-sm rounded-btn"
                  to="/events"
                >
                  Events
                </NavLink>
                <NavLink
                  className="btn btn-ghost btn-sm rounded-btn"
                  to="/calendar"
                >
                  Calendar
                </NavLink>
              </div>
            </div>
          )}

          {context.token && (
            <div className="navbar-end">
              <NavLink
                className="btn btn-ghost btn-sm rounded-btn mr-4"
                to="/profile"
              >
                Profile
              </NavLink>
              <button
                class="btn btn-outline btn-circle btn-sm mr-2"
                onClick={context.logout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="5"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;

