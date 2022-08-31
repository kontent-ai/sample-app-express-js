import { config } from 'dotenv';
config();
import AboutUs from './models/about-us';
import Accessory from './models/accessory';
import Article from './models/article';
import Brewer from './models/brewer';
import Cafe from './models/cafe';
import Coffee from './models/coffee';
import FactAboutUs from './models/fact-about-us';
import Grinder from './models/grinder';
import HeroUnit from './models/hero-unit';
import Home from './models/home';
import HostedVideo from './models/hosted-video';
import Office from './models/office';
import Tweet from './models/tweet';
import { DeliveryClient, TypeResolver } from '@kontent-ai/delivery-sdk';
const typeResolvers = [
  new TypeResolver('about_us', () => new AboutUs()),
  new TypeResolver('accessory', () => new Accessory()),
  new TypeResolver('article', () => new Article()),
  new TypeResolver('brewer', () => new Brewer()),
  new TypeResolver('cafe', () => new Cafe()),
  new TypeResolver('coffee', () => new Coffee()),
  new TypeResolver('fact_about_us', () => new FactAboutUs()),
  new TypeResolver('grinder', () => new Grinder()),
  new TypeResolver('hero_unit', () => new HeroUnit()),
  new TypeResolver('home', () => new Home()),
  new TypeResolver('hosted_video', () => new HostedVideo()),
  new TypeResolver('office', () => new Office()),
  new TypeResolver('tweet', () => new Tweet())
];

export default new DeliveryClient({
  projectId: process.env.projectId,
  typeResolvers: typeResolvers
});