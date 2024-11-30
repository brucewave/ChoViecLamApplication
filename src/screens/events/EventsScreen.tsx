import React, {useEffect, useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {appColors} from '../../constants/appColors';
import {JobModel} from '../../models/JobModel';
import {globalStyles} from '../../styles/globalStyles';
import {LoadingModal} from '../../modals';

import TextComponent from '../../components/TextComponent'
import { ButtonComponent, ContainerComponent, EventItem, RadioButtons, SectionComponent } from '../../components';
import jobAPI from '../../apis/jobApi';

const EventsScreen = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<JobModel[]>([]);
  const [eventType, setEventType] = useState<string>('upcoming');

  useEffect(() => {
    getData();
  }, [eventType]);

  const getData = async () => {
    setIsLoading(true);
    await getEvents();
    setIsLoading(false);
  };

  const getEvents = async () => {
    const api = `/getEvents`;

    try {
      const res: any = await jobAPI.HandleJob(api,null,'get');
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderEmptyComponent = (
    <View style={{flex: 1}}>
      <View style={[globalStyles.center, {flex: 1}]}>
        <Image
          source={require('../../assets/images/empty-events.png')}
          style={{width: 202, height: 202}}
        />
        <TextComponent
          text="Không tìm thấy việc làm nào"
          title
          size={24}
          styles={{marginVertical: 12}}
        />

        <View style={{width: '70%'}}>
          <TextComponent
            text="Lorem ipsum dolor sit amet, consectetur"
            size={16}
            color="#747688"
            styles={{textAlign: 'center'}}
          />
        </View>
      </View>
      <SectionComponent styles={{}}>
        <ButtonComponent
          onPress={() => navigation.navigate('ExploreEvents')}
          text="Explore events"
          type="primary"
        />
      </SectionComponent>
    </View>
  );

  return (
    <ContainerComponent
      title="Việc Làm"
      back
      right={
        <ButtonComponent
          icon={
            <MaterialIcons name="more-vert" size={22} color={appColors.text} />
          }
        />
      }
      isScroll={false}>
      <RadioButtons
        selected={eventType}
        onSelect={(id: string) => setEventType(id)}
        data={[
          {
            label: 'Tìm Việc',
            value: 'upcoming',
          },
          {
            label: 'Tìm Người',
            value: 'pastEvent',
          },
        ]}
      />
      {events.length > 0 ? (
        <FlatList
          data={events}
          contentContainerStyle={{ padding: 0 }}
          renderItem={({item}) => (
            <EventItem
              item={item}
              key={item._id}
              type="list"
              styles={{flex: 1, width: '100%', margin: 0, padding: 0}}
            />
          )}
        />
      ) : (
        renderEmptyComponent
      )}

      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default EventsScreen;