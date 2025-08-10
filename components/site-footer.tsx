export function SiteFooter() {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-5xl px-4">
        <div className="pt-2 pb-3 text-center text-[15px] leading-[1.88] text-[#162B6F]">
          <p className="sr-only">Contact</p>
          <p className="invisible">​</p>
          <p>{"‪(650) 492-8041‬"}</p>
          <p>
            <a href="mailto:mathnuts@googlegroups.com" className="underline hover:no-underline">
              mathnuts@googlegroups.com
            </a>
          </p>
        </div>
        <div className="pb-8 text-center text-[14px] leading-[1.79] text-[#162B6F]">
          <p>©2023 by Mathnuts.org.&nbsp;</p>
        </div>
      </div>
    </footer>
  )
}
