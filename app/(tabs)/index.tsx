import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  
  const {
    data: TrendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
  } = useFetch(() => fetchMovies({ query: "" }));

  if (movieLoading || trendingLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (movieError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white">Error: {movieError?.message || trendingError?.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pb-32"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="search for a movie"
              value={searchValue}
              onChangeText={setSearchValue}
            />

            {TrendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">trending Movies</Text>
              </View>
            )}

            <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4"/>}
            className="mb-4 mt-3" data={TrendingMovies} renderItem={({
              item, index }) => (
              <TrendingCard movie={item} index={index} />
            ) }
            keyExtractor={(item) => item.movie_id.toString()}
            >
            </FlatList>

          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movie
          </Text>
          </>
        }
        renderItem={({ item }) => (
          <MovieCard 
            {...item}
          />
        )}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
          paddingHorizontal: 5,
        }}
      />
    </View>
  );
}
