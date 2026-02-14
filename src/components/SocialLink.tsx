import type {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export function SocialLink({ href, target, icon, iconClassName, label }: { href: string; target?: string; icon: IconProp; iconClassName?: string; label: string }) {
  return (
    <a href={href} target={target} className="inline-flex items-center justify-center bg-slate-200 hover:bg-white hover:shadow-lg size-14 p-2 rounded-xl group/icon transition-all duration-200">
      <FontAwesomeIcon icon={icon} size="2x" className={clsx("opacity-90 group-hover/icon:opacity-100 group-hover/icon:scale-105 transition duration-200", iconClassName)} />
      <span className="sr-only">{label}</span>
    </a>
  );
}
