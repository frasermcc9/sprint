import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/solid";
import {
  ExperienceLevel,
  useCompleteOnboardingMutation,
  useCurrentUserQuery,
} from "@sprint/gql";
import classNames from "classnames";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Pagination } from "swiper";
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
  const { firstName, lastName, setFirstName, setLastName, completeOnboarding } =
    useController();
  const [swiper, setSwiper] = useState<any>(null);

  const slideNext = useCallback(() => swiper.slideNext(), [swiper]);
  const slidePrev = useCallback(() => swiper.slidePrev(), [swiper]);

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
  const [activeButton, setActiveButton] = useState(0);
  const buttons = useMemo(
    () => [
      {
        text: "A little new to this",
        emoji: <Tree />,
        color: "bg-emerald-500",
      },
      {
        text: "An adept exerciser",
        emoji: <Shoes />,
        color: "bg-amber-500",
      },
      {
        text: "A full on fitness freak",
        emoji: <Mountain />,
        color: "bg-red-500",
      },
    ],
    [Mountain, Shoes, Tree],
  );

  return (
    <div className="mb-8 flex h-full flex-grow">
      <Swiper
        spaceBetween={50}
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
                  onChange={setFirstName}
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
                  onChange={setLastName}
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
          <SlideContent title="Pick which best describes you">
            <div className="font-palanquin flex flex-col items-center gap-y-4 p-1 px-8">
              {buttons.map(({ emoji, text, color }, i) => (
                <button
                  key={text}
                  className={classNames(
                    "text-bold flex w-full items-center gap-x-4 rounded px-4 py-4 font-medium text-white transition-colors",
                    color,
                    { "bg-gray-400 saturate-0": i !== activeButton },
                  )}
                  onClick={() => setActiveButton(i)}
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
              <div className="mx-auto max-w-xs pb-8 text-center">
                {"So just to confirm, your name is "}
                <span className="text-indigo-600">
                  {firstName} {lastName}
                </span>
                {" and you are "}
                <span className="text-indigo-600">
                  {buttons[activeButton].text.toLowerCase()}!
                </span>
              </div>
              <div className="flex flex-col gap-y-4">
                <SlideButton
                  text="Yes! Lets go!"
                  onClick={async () =>
                    await completeOnboarding({
                      variables: {
                        experience: experienceMap[activeButton],
                        firstName,
                        lastName,
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

  const [firstName, setFirstName] = useState(
    data?.currentUser?.firstName || "",
  );
  const [lastName, setLastName] = useState(data?.currentUser?.lastName || "");

  useEffect(() => {
    if (data?.currentUser) {
      setFirstName(data.currentUser.firstName);
      setLastName(data.currentUser.lastName);
    }
  }, [data]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    completeOnboarding,
  };
};

export const useMockOnboardingSlidesController: typeof useOnboardingSlidesController =
  () => {
    return {
      firstName: "Fraser",
      lastName: "McCallum",
      setFirstName: () => null,
      setLastName: () => null,
      completeOnboarding: (): any => null,
    };
  };

export default OnboardingSlides;
