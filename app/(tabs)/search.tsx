import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false); // autoFetch = false

  useEffect(() => {  
    const timeoutId = setTimeout( async () => {
        if(searchQuery.trim()){
          await loadMovies();          
        } else{
          reset(); // Reset data when searchQuery is empty
        }
      }, 500);

      return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if(movie?.length > 0 && movie?.[0])
        updateSearchCount(searchQuery,movie[0]);
  }, [movie]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movie}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10"/>
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search Movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}                
              />
            </View>

            {movieLoading &&(
              <ActivityIndicator size="large" color="#0000ff" className="my-3"/>
            )}
            {movieError &&(
              <Text className="text-red-500 px-5 my-3" >
                Error: {movieError.message}
              </Text>
            )}
            {!movieLoading && !movieError && searchQuery.trim() && movie?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Result for{' '}
                <Text className="text-accent">
                  {searchQuery}
                </Text>
              </Text>              
            )}
          </>
        }

        ListEmptyComponent={
          !movieLoading && !movieError ? (            
            <View className="mt-10 px-5" >
              <Text className="text-center text-gray-500" >
                {searchQuery.trim() ? 'No MOvie Found' : 'Search for a Movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default search;