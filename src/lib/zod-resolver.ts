import { zodResolver as baseZodResolver } from "@hookform/resolvers/zod";

export const zodResolver = baseZodResolver as typeof baseZodResolver;
