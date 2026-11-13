import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}));

vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

import { BackToTop } from "@/components/BackToTop";

const ARIA_LABEL = "aria.scroll.top";

describe("BackToTop", () => {
  const trackMock = { current: vi.fn() };

  const scrollToMock = vi.fn();
  const scrollByMock = vi.fn();
  let rafSpy: ReturnType<typeof vi.spyOn>;
  // O componente agenda setVisible num requestAnimationFrame e usa um flag
  // `ticking` pra throttle. Um rAF que roda o callback de forma SINCRONA
  // quebra a ordem (cb seta ticking=false antes do handler setar ticking=true),
  // e o segundo scroll e engolido. Aqui guardamos o callback e o rodamos DEPOIS
  // do dispatch, reproduzindo o rAF assincrono de verdade.
  let rafCb: FrameRequestCallback | null;

  const scrollTo = (y: number) => {
    window.scrollY = y;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      const cb = rafCb;
      rafCb = null;
      if (cb) cb(0);
    });
  };

  beforeEach(() => {
    trackMock.current = vi.fn();
    window.scrollTo = scrollToMock as unknown as typeof window.scrollTo;
    window.scrollBy = scrollByMock as unknown as typeof window.scrollBy;
    window.scrollY = 0;
    rafCb = null;
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCb = cb;
        return 0;
      });
  });

  afterEach(() => {
    rafSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("stays hidden when scroll is below the threshold", () => {
    window.scrollY = 0;
    render(<BackToTop />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("appears once scroll surpasses the threshold", () => {
    render(<BackToTop />);
    scrollTo(401);

    expect(screen.getByRole("button")).toHaveAttribute("aria-label", ARIA_LABEL);
    expect(screen.getByRole("button")).toHaveAttribute("title", ARIA_LABEL);
  });

  it("disappears again after scrolling back above the threshold", () => {
    render(<BackToTop />);

    scrollTo(401);
    expect(screen.getByRole("button")).toBeInTheDocument();

    scrollTo(100);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("scrolls to top and fires the tracking event on click", async () => {
    const user = userEvent.setup();
    render(<BackToTop />);
    scrollTo(500);

    const button = screen.getByRole("button");
    await act(async () => {
      await user.click(button);
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("registers a passive scroll listener", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<BackToTop />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true },
    );
  });
});
