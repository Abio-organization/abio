import { Loader2 } from "lucide-react";

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
        <Loader2 className="h-6 w-6 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="min-w-0">
        <div className="m2-4 flex justify-end lg:hidden">
          <SharePanel username={user.profile?.username ?? null} />
        </div>
        <h1 className="my-5 lg:mb-10 lg:mt-0 text-3xl font-semibold text-[#331400] dark:text-[#F5EEE4]">
          Hi, {user.profile?.username ?? user.name}
        </h1>

        {/* <div className="mb-8 lg:hidden">
          <SharePanel username={user.profile?.username ?? null} />
        </div> */}

        <ProfileHeader user={user} />

        <div className="mt-8">
          {linksLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
            </div>
          ) : (
            <LinkList links={links ?? []} />
          )}
        </div>

        <div className="mt-4">
          <AddLinkDialog />
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
