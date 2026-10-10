import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Clapperboard } from 'lucide-react';
import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { useUniverseStore } from '../../store/universeStore';
import { pageVariants } from '../../animations/transitions';
import {
  MEDIA_REGISTRY,
  MediaType,
  getFeaturedMedia,
  searchMedia,
  MediaItem,
} from '../../data/media';
import { isCinemaFavorite } from '../../data/cinemaStore';
import { MediaCard } from '../../components/Cinema/MediaCard';
import { CinemaFeaturedHero } from '../../components/Cinema/CinemaFeaturedHero';
import { CinemaDetailsModal } from '../../components/Cinema/CinemaDetailsModal';
import { CinematicVideoPlayer } from '../../components/Cinema/CinematicVideoPlayer';
import { VirtualTheaterMode } from '../../components/Cinema/VirtualTheaterMode';
import { StoryViewer } from '../../components/Cinema/StoryViewer';
import { PhotoGallery } from '../../components/Cinema/PhotoGallery';
import { VideoGallery } from '../../components/Cinema/VideoGallery';
import { CinemaCategoryFilter } from '../../components/Cinema/CinemaCategoryFilter';
import { CinemaSearch } from '../../components/Cinema/CinemaSearch';
import { ContinueWatchingSection } from '../../components/Cinema/ContinueWatchingSection';

export const CinemaWorld: React.FC = () => {
  // store
  useUniverseStore();
  const [selectedCategory, setSelectedCategory] = useState<MediaType | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active overlays
  const [activeDetailsItem, setActiveDetailsItem] = useState<MediaItem | null>(null);
  const [activePlayingItem, setActivePlayingItem] = useState<MediaItem | null>(null);
  const [activeTheaterItem, setActiveTheaterItem] = useState<MediaItem | null>(null);
  const [activeStoryItem, setActiveStoryItem] = useState<MediaItem | null>(null);
  const [activePhotoGallery, setActivePhotoGallery] = useState<MediaItem | null>(null);
  const [showVideoGallery, setShowVideoGallery] = useState(false);

  const featuredList = getFeaturedMedia();

  // Filter media
  let mediaList = searchMedia(searchQuery, selectedCategory === 'favorites' ? 'all' : selectedCategory);
  if (selectedCategory === 'favorites') {
    mediaList = MEDIA_REGISTRY.filter((m) => isCinemaFavorite(m.id));
  }

  const handleOpenItem = (item: MediaItem) => {
    if (item.type === 'story') {
      setActiveStoryItem(item);
    } else if (item.type === 'photo') {
      setActivePhotoGallery(item);
    } else if (item.type === 'video' && item.id === 'universe-video-album') {
      setShowVideoGallery(true);
    } else {
      setActiveDetailsItem(item);
    }
  };

  const handleQuickPlay = (item: MediaItem) => {
    if (item.type === 'story') {
      setActiveStoryItem(item);
    } else if (item.type === 'photo') {
      setActivePhotoGallery(item);
    } else if (item.type === 'video' && item.id === 'universe-video-album') {
      setShowVideoGallery(true);
    } else {
      setActivePlayingItem(item);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-7xl mx-auto select-none pb-12"
    >
      {/* Navigation Headers */}
      <ReturnToUniverse worldName="CINEMA WORLD" themeColor="#FF2A55" />
      <WorldBreadcrumb worldName="CINEMA WORLD" themeColor="#FF2A55" />

      {/* Sub-Views (Story Reader, Photo Gallery, Video Gallery) */}
      {activeStoryItem ? (
        <StoryViewer item={activeStoryItem} onClose={() => setActiveStoryItem(null)} />
      ) : activePhotoGallery ? (
        <PhotoGallery item={activePhotoGallery} onBack={() => setActivePhotoGallery(null)} />
      ) : showVideoGallery ? (
        <VideoGallery
          onPlayClip={(clip) => setActivePlayingItem(clip)}
          onBack={() => setShowVideoGallery(false)}
        />
      ) : (
        <>
          {/* Featured Spotlight Hero Marquee */}
          <CinemaFeaturedHero
            featuredList={featuredList}
            onPlay={handleQuickPlay}
            onDetails={(item) => setActiveDetailsItem(item)}
          />

          {/* Continue Watching Section */}
          <ContinueWatchingSection onSelect={handleQuickPlay} />

          {/* Controls Bar: Category Filter + Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <CinemaCategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
            <CinemaSearch query={searchQuery} onQueryChange={setSearchQuery} />
          </div>

          {/* Media Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-red-500" />
                <h3 className="font-orbitron font-bold text-lg text-white">
                  {selectedCategory === 'favorites'
                    ? 'FAVORITE MEDIA'
                    : selectedCategory === 'all'
                    ? 'ALL MULTIVERSE CATALOGUE'
                    : selectedCategory.toUpperCase().replace('-', ' ') + 'S'}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {mediaList.length} Items Available
              </span>
            </div>

            {mediaList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="font-orbitron font-bold text-base text-slate-300">
                  No Media Found
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keywords or filter category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {mediaList.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={handleOpenItem}
                    onQuickPlay={handleQuickPlay}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals and Overlays */}
      {activeDetailsItem && (
        <CinemaDetailsModal
          item={activeDetailsItem}
          onClose={() => setActiveDetailsItem(null)}
          onPlay={(item) => {
            setActiveDetailsItem(null);
            setActivePlayingItem(item);
          }}
          onTheaterMode={(item) => {
            setActiveDetailsItem(null);
            setActiveTheaterItem(item);
          }}
        />
      )}

      {activePlayingItem && (
        <CinematicVideoPlayer
          item={activePlayingItem}
          onClose={() => setActivePlayingItem(null)}
          onOpenTheater={(item) => {
            setActivePlayingItem(null);
            setActiveTheaterItem(item);
          }}
        />
      )}

      {activeTheaterItem && (
        <VirtualTheaterMode
          item={activeTheaterItem}
          onExit={() => setActiveTheaterItem(null)}
        />
      )}
    </motion.div>
  );
};
