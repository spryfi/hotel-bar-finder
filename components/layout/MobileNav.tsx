'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/search', label: 'Search', icon: '🔍' },
    { href: '/favorites', label: 'Favorites', icon: '❤️' },
    { href: '/login', label: 'Sign In', icon: '👤' },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50 md:hidden">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[var(--primary-900)] px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 text-[var(--accent-500)]">🍸</div>
                    <span className="text-lg font-bold text-white">
                      Hotel Bar Finder
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    
                    <li className="mt-auto">
                      <Link
                        href="/signup"
                        onClick={onClose}
                        className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-colors duration-200"
                      >
                        <span className="text-lg">✨</span>
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}