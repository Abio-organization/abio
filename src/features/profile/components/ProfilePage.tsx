import { Loader2 } from "lucide-react";
import { Loader } from '@/shared/components/loader';
import { PhoneDisplay } from "@/shared/components/PhoneDisplay";
import { usePhoneDisplayProps } from "@/shared/hooks/usePhoneDisplayProps";

import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useGetAllLinks } from "@/features/links";

import { AddLinkDialog } from "@/features/profile/components/AddLinkDialog";
import { LinkList } from "@/features/profile/components/LinkList";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { SharePanel } from "@/features/profile/components/SharePanel";

export function ProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: links, isLoading: linksLoading } = useGetAllLinks();
  const phone = usePhoneDisplayProps();

  if (userLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="min-w-0">
        <div className="m2-4 flex items-center justify-between ">
          <h1 className="my-5 lg:mb-10 lg:mt-0 text-3xl font-semibold text-[#331400] dark:text-[#F5EEE4]">
            Hi, {user.profile?.username ?? user.name}
          </h1>
          <div className="lg:hidden">
            <SharePanel username={user.profile?.username ?? null} />
          </div>
        </div>

        {/* <div className="mb-8 lg:hidden">
          <SharePanel username={user.profile?.username ?? null} />
        </div> */}

        <ProfileHeader user={user} />
        <div className="relative mt-8 mb-4">
          <div className="flex flex-col -translate-y-1/2  gap-2 bg-[#FFFFFF] pr-3 dark:bg-[#1C1611]">
            <span className="text-sm font-medium text-[#331400] dark:text-[#F5EEE4]">
              Links
            </span>
            <div className="h-[3px] w-6 bg-red-500" />
          </div>
          {/* <div className="border-t border-[#331400]/10 dark:border-[#F5EEE4]/10" /> */}
        </div>
        <div className="relative mt-2">
          <div className="max-h-[calc(100vh-26rem)] overflow-y-auto overflow-x-hidden pb-5 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {linksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
              </div>
            ) : (
              <LinkList links={links ?? []} />
            )}
          </div>

          <div className="pointer-events-none sticky bottom-0 z-20 mt-4 flex justify-center pb-2">
            <div className="pointer-events-auto w-full">
              <AddLinkDialog />
            </div>
          </div>
        </div>
      </section>

      <aside className="hidden min-w-0 flex-col gap-6 lg:flex">
        <SharePanel username={user.profile?.username ?? null} />

        <div className="flex justify-center">
          {phone.isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
          ) : (
            <PhoneDisplay
              buttonStyle={phone.buttonStyle}
              fontStyle={phone.fontStyle}
              selectedTheme={phone.selectedTheme}
              profile={phone.profile}
              links={phone.links}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
