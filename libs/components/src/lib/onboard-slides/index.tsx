import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/solid";
import { calculateAge, toYYYYMMDD } from "@sprint/common";
import {
  ExperienceLevel,
  useCompleteOnboardingMutation,
  useCurrentUserQuery,
} from "@sprint/gql";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ISwiper, { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEmoji } from "../hooks/useEmoji";
import TextInput from "../text-input";
import SlideContent from "./slide";
import SlideButton from "./slide-button";

export interface OnboardingSlidesProps {
  useController: typeof useOnboardingSlidesController;
}

export const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({
  useController,
}) => {
  const {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    completeOnboarding,
    experience,
    setExperience,
    dob,
    setDob,
  } = useController();
  const [swiper, setSwiper] = useState<ISwiper | null>(null);

  const slideNext = useCallback(() => swiper?.slideNext(), [swiper]);
  const slidePrev = useCallback(() => swiper?.slidePrev(), [swiper]);

  const Tree = useEmoji("🌲", "1.5rem");
  const Shoes = useEmoji("👟", "1.5rem");
  const Mountain = useEmoji("🗻", "1.5rem");

  const experienceMap = useMemo(
    () => [
      ExperienceLevel.Beginner,
      ExperienceLevel.Intermediate,
      ExperienceLevel.Advanced,
    ],
    [],
  );

  const buttons = useMemo(
    () => ({
      [ExperienceLevel.Beginner]: {
        text: "A little new to this",
        emoji: <Tree />,
        color: "bg-emerald-500",
      },
      [ExperienceLevel.Intermediate]: {
        text: "An adept exerciser",
        emoji: <Shoes />,
        color: "bg-amber-500",
      },
      [ExperienceLevel.Advanced]: {
        text: "A full on fitness freak",
        emoji: <Mountain />,
        color: "bg-red-500",
      },
    }),
    [Mountain, Shoes, Tree],
  );

  return (
    <div className="mb-8 flex h-full flex-grow">
      <Swiper
        spaceBetween={100}
        slidesPerView={1}
        className=""
        pagination={true}
        modules={[Pagination]}
        onSwiper={setSwiper}
        allowTouchMove={false}
      >
        <SwiperSlide>
          <SlideContent title="Is this your name?">
            <div className="flex flex-col gap-y-4 p-1 px-8">
              <div>
                <label
                  className="ml-0.5 text-sm font-semibold underline"
                  htmlFor="first-name"
                >
                  First Name:
                </label>
                <TextInput
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="ml-0.5 text-sm font-semibold underline"
                  htmlFor="last-name"
                >
                  Last Name:
                </label>
                <TextInput
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <SlideButton
                className="self-end"
                text="Next"
                onClick={slideNext}
                icon={<ArrowCircleRightIcon className="w-8" />}
              />
            </div>
          </SlideContent>
        </SwiperSlide>
        <SwiperSlide>
          <SlideContent title="Is this your date of birth?">
            <div className="flex flex-col gap-y-4 p-1 px-8">
              <div>
                <label
                  className="ml-0.5 text-sm font-semibold underline"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <TextInput
                  id="dob"
                  value={toYYYYMMDD(dob)}
                  onChange={(e) => setDob(e.target.valueAsDate ?? new Date())}
                  type="date"
                />
              </div>
              <div className="mt-4 flex w-full justify-between">
                <SlideButton
                  text="Previous"
                  onClick={slidePrev}
                  icon={<ArrowCircleLeftIcon className="w-8" />}
                  iconStart
                />
                <SlideButton
                  text="Next"
                  onClick={slideNext}
                  icon={<ArrowCircleRightIcon className="w-8" />}
                />
              </div>
            </div>
          </SlideContent>
        </SwiperSlide>
        <SwiperSlide>
          <SlideContent title="Pick which best describes you">
            <div className="font-palanquin flex flex-col items-center gap-y-4 p-1 px-8">
              {Object.values(buttons).map(({ emoji, text, color }, i) => (
                <button
                  key={text}
                  className={classNames(
                    "text-bold flex w-full items-center gap-x-4 rounded px-4 py-4 font-medium text-white transition-colors",
                    color,
                    {
                      "bg-gray-400 saturate-0": experienceMap[i] !== experience,
                    },
                  )}
                  onClick={() => setExperience(experienceMap[i])}
                >
                  {emoji}
                  {text}
                </button>
              ))}
              <div className="mt-4 flex w-full justify-between">
                <SlideButton
                  text="Previous"
                  onClick={slidePrev}
                  icon={<ArrowCircleLeftIcon className="w-8" />}
                  iconStart
                />
                <SlideButton
                  text="Next"
                  onClick={slideNext}
                  icon={<ArrowCircleRightIcon className="w-8" />}
                />
              </div>
            </div>
          </SlideContent>
        </SwiperSlide>
        <SwiperSlide>
          <SlideContent title="Wrapping Up">
            <div className="font-palanquin w-full items-center gap-y-4 p-1 px-8 font-normal">
              <div
                className="mx-auto max-w-sm px-10 pb-8 text-justify"
                style={{ textAlignLast: "center" }}
              >
                {"So just to confirm, your name is "}
                <span className="text-indigo-600">
                  {firstName} {lastName}
                </span>
                {", you are "}
                <span className="text-indigo-600">
                  {calculateAge(toYYYYMMDD(dob))}
                </span>

                {", and you are "}
                <span className="text-center text-indigo-600">
                  {buttons[experience].text.toLowerCase()}!
                </span>
              </div>
              <div className="flex flex-col gap-y-4">
                <SlideButton
                  text="Yes! Lets go!"
                  onClick={async () =>
                    await completeOnboarding({
                      variables: {
                        experience,
                        firstName,
                        lastName,
                        dob: toYYYYMMDD(dob),
                      },
                    })
                  }
                  className="h-12 w-full justify-center"
                />
                <SlideButton
                  text="Previous"
                  onClick={slidePrev}
                  icon={<ArrowCircleLeftIcon className="w-8" />}
                  iconStart
                  className="w-fit saturate-0"
                />
              </div>
            </div>
          </SlideContent>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export const useOnboardingSlidesController = () => {
  const { data } = useCurrentUserQuery();
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const currentUser = data?.currentUser;

  const [details, setDetails] = useState({
    firstName: currentUser?.firstName ?? "",
    lastName: currentUser?.lastName ?? "",
    experience: currentUser?.experience ?? ExperienceLevel.Beginner,
    dob: currentUser?.dob ? new Date(currentUser.dob) : new Date(),
  });

  const setFirstName = useCallback((firstName: string) => {
    setDetails((d) => ({ ...d, firstName }));
  }, []);
  const setLastName = useCallback((lastName: string) => {
    setDetails((d) => ({ ...d, lastName }));
  }, []);
  const setExperience = useCallback((experience: ExperienceLevel) => {
    setDetails((d) => ({ ...d, experience }));
  }, []);
  const setDob = useCallback((dob: Date) => {
    setDetails((d) => ({ ...d, dob: dob }));
  }, []);

  useEffect(() => {
    if (data?.currentUser) {
      setFirstName(data.currentUser.firstName);
      setLastName(data.currentUser.lastName);
      setDob(new Date(data.currentUser.dob));
    }
  }, [data, setDob, setFirstName, setLastName]);

  return {
    ...details,
    setFirstName,
    setLastName,
    setExperience,
    setDob,
    completeOnboarding,
  };
};

export const useMockOnboardingSlidesController: typeof useOnboardingSlidesController =
  () => {
    return {
      experience: ExperienceLevel.Beginner,
      firstName: "Fraser",
      lastName: "McCallum",
      dob: new Date("06/04/2000"),
      setExperience: () => null,
      setFirstName: () => null,
      setLastName: () => null,
      setDob: () => null,
      completeOnboarding: (): any => null,
    };
  };

export default OnboardingSlides;
