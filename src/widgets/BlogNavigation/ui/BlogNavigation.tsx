import { useState } from "react";
import Link from "next/link";
import { MessageSquare, LayoutGrid, Flag, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/shared/ui";

const BlogNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const recentChats = [
    "Responsive Navigation Ba...",
    "Multi-Language Editor",
    "OAuth2 Login Options",
    "Editor Page Design",
    "Blog Platform Design",
  ];

  return (
    <div className="relative flex flex-row h-screen">
      {/* 네비게이션 바 */}
      <nav
        className={`
          p-4
          transform transition-transform duration-300 ease-in-out
          h-screen w-64
          fixed top-0 left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:left-0 md:top-0
        `}
      >
        {/* 상단 로고와 열고 닫는 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="w-8 h-8" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
            </svg>
          </div>
          {/* md 이상에서는 버튼 숨기기 */}
          <Button variant="outline" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full mb-4 text-left justify-start" size="large">
          New Chat
        </Button>

        <div className="space-y-1 mb-4">
          <Button className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat History
          </Button>
          <Button className="w-full justify-start">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Projects
          </Button>
          <Button className="w-full justify-start">
            <Flag className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        </div>

        <div className="text-xs text-gray-400 mb-2">Recent Chats</div>
        <div className="flex-grow scroll-area">
          {recentChats.map((chat, index) => (
            <Link key={index} href="#" className="block py-2 px-3 text-sm   rounded">
              {chat}
            </Link>
          ))}
          <Link href="#" className="block py-2 px-3 text-sm text-gray-400  rounded">
            View All <ChevronRight className="inline h-4 w-4" />
          </Link>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <Button className="w-full justify-start">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-500 to-orange-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Iodado</div>
                <div className="text-xs text-gray-400">Free</div>
              </div>
            </div>
          </Button>
        </div>
      </nav>

      {!isOpen && (
        <div className="fixed inset-0 bg-red opacity-50 md:hidden" onClick={() => setIsOpen(true)}>
          클릭
        </div>
      )}

      {/* 콘텐츠 영역: md 이상 크기에서 nav의 너비만큼 마진 추가 */}
      <div className={`md:ml-[${isOpen ? 64 * 4 + "px" : 0}]`}>13wqeqwewq</div>
    </div>
  );
};

export default BlogNavigation;
