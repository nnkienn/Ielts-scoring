// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'asfasfasfasfasf546412421?@asdfk';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
